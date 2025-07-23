#!/usr/bin/env bun

import { execSync } from "node:child_process";
import { existsSync, statSync, readdirSync } from "node:fs";
import { join, relative, dirname } from "node:path";

interface CompileOptions {
  force?: boolean;
  specificFolders?: string[];
}

function findProjectFolders(): string[] {
  const folders: string[] = [];
  const entries = readdirSync(".", { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory() && 
        !entry.name.startsWith('.') && 
        entry.name !== 'scripts' && 
        entry.name !== 'node_modules') {
      const typescriptDir = join(entry.name, 'typescript');
      if (existsSync(typescriptDir)) {
        folders.push(entry.name);
      }
    }
  }
  
  return folders;
}

function findTypeScriptFiles(projectFolder: string): string[] {
  const typescriptDir = join(projectFolder, 'typescript');
  
  if (!existsSync(typescriptDir)) {
    return [];
  }

  try {
    const result = execSync(`find ${typescriptDir} -name "*.ts" -type f -not -path "*/node_modules/*"`, {
      encoding: "utf-8",
    });
    return result.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function getOutputPath(tsFile: string, projectFolder: string): string {
  const typescriptDir = join(projectFolder, 'typescript');
  const javascriptDir = join(projectFolder, 'javascript');
  const relativePath = relative(typescriptDir, tsFile);
  return join(javascriptDir, relativePath.replace(/\.ts$/, ".js"));
}

function shouldCompile(tsFile: string, projectFolder: string, options: CompileOptions): boolean {
  // If force flag is set, compile everything
  if (options.force) {
    return true;
  }

  // Otherwise, only compile if JS file doesn't exist or is older than TS file
  const jsFile = getOutputPath(tsFile, projectFolder);

  if (!existsSync(jsFile)) {
    return true;
  }

  const tsStats = statSync(tsFile);
  const jsStats = statSync(jsFile);

  return tsStats.mtime > jsStats.mtime;
}

function compileTypeScript(projectFolder: string, files: string[]): void {
  if (files.length === 0) {
    console.log(`No files to compile in ${projectFolder}.`);
    return;
  }

  console.log(`Compiling ${files.length} TypeScript file(s) in ${projectFolder}...`);

  const javascriptDir = join(projectFolder, 'javascript');
  const typescriptDir = join(projectFolder, 'typescript');
  
  // Ensure output directory exists
  execSync(`mkdir -p ${javascriptDir}`, { stdio: "inherit" });

  // Copy package.json and other config files if they exist
  const configFiles = ['package.json', 'package-lock.json', '.env.example', '.env'];
  for (const configFile of configFiles) {
    const srcPath = join(typescriptDir, configFile);
    const destPath = join(javascriptDir, configFile);
    if (existsSync(srcPath)) {
      execSync(`cp ${srcPath} ${destPath}`, { stdio: "inherit" });
    }
  }

  // Create a temporary tsconfig.json for compilation
  const tempTsConfig = join(javascriptDir, 'tsconfig.json');
  const tsConfigContent = {
    "compilerOptions": {
      "target": "es2022",
      "module": "esnext",
      "moduleResolution": "bundler",
      "allowSyntheticDefaultImports": true,
      "esModuleInterop": true,
      "outDir": ".",
      "declaration": false,
      "removeComments": false,
      "skipLibCheck": true,
      "strict": false
    },
    "include": files.map(f => relative(javascriptDir, f))
  };
  
  execSync(`echo '${JSON.stringify(tsConfigContent, null, 2)}' > ${tempTsConfig}`, { stdio: "inherit" });

  try {
    // Change to javascript directory and compile
    execSync(`cd ${javascriptDir} && bunx tsc`, { stdio: "inherit" });
    console.log(`TypeScript compilation completed for ${projectFolder}.`);

    // Clean up temp tsconfig
    execSync(`rm ${tempTsConfig}`, { stdio: "inherit" });

    // Format the output files with 2-space indentation
    try {
      console.log(`Formatting generated JavaScript files in ${projectFolder}...`);
      execSync(`cd ${javascriptDir} && bunx prettier --write --tab-width 2 --use-tabs false "*.js"`, { stdio: "inherit" });
      console.log(`Formatting completed for ${projectFolder}.`);
    } catch {
      console.log("Skipping formatting (prettier not available)");
    }
  } catch (error) {
    console.error(`Compilation failed for ${projectFolder}:`, error);
    process.exit(1);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const options: CompileOptions = {};

  // Parse command line arguments
  const specificFolders: string[] = [];
  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg === "--force" || arg === "-f") {
      options.force = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
Usage: bun scripts/generate-js-ts [options] [folders...]

Options:
  --force, -f     Force regenerate all TypeScript files
  --help, -h      Show this help message

Examples:
  bun scripts/generate-js-ts                           # Generate new files only
  bun scripts/generate-js-ts --force                   # Regenerate all files
  bun scripts/generate-js-ts 01-first-listener        # Regenerate specific folder
`);
      process.exit(0);
    } else {
      // Check if it's a valid project folder
      const typescriptDir = join(arg, 'typescript');
      if (existsSync(typescriptDir)) {
        specificFolders.push(arg);
      } else {
        console.error(`Folder not found or doesn't contain typescript/: ${arg}`);
        process.exit(1);
      }
    }
    i++;
  }

  if (specificFolders.length > 0) {
    options.specificFolders = specificFolders;
  }

  // Find all project folders
  const allProjectFolders = options.specificFolders || findProjectFolders();

  if (allProjectFolders.length === 0) {
    console.log("No project folders with typescript/ directories found.");
    return;
  }

  console.log(`Found project folders: ${allProjectFolders.join(", ")}`);

  // Process each project folder
  for (const projectFolder of allProjectFolders) {
    console.log(`\n--- Processing ${projectFolder} ---`);
    
    const allTsFiles = findTypeScriptFiles(projectFolder);
    
    if (allTsFiles.length === 0) {
      console.log(`No TypeScript files found in ${projectFolder}/typescript/.`);
      continue;
    }

    // Determine which files to compile
    const filesToCompile = allTsFiles.filter((file) =>
      shouldCompile(file, projectFolder, options)
    );

    if (filesToCompile.length === 0) {
      console.log(`All JavaScript files are up to date in ${projectFolder}.`);
      continue;
    }

    // Log what we're doing
    if (options.force) {
      console.log(`Force regenerating all TypeScript files in ${projectFolder}...`);
    } else {
      console.log(`Generating JavaScript for new/modified TypeScript files in ${projectFolder}...`);
    }

    compileTypeScript(projectFolder, filesToCompile);
  }
}

// Run the main function when script is executed directly
main();