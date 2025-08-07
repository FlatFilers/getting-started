import { peopleHook } from "./listeners/people-hook.listener";
import { submitHandler } from "./listeners/submit-handler.listener";
import { spaceConfig } from "./listeners/configure-space.listener";

export default function (listener) {
  // Configure the Space with the SpaceConfigure Plugin
  listener.use(spaceConfig);

  // Build Record Hook for the people sheet
  listener.use(peopleHook);
  
  // Handle Submit Action with JobHandler Plugin
  listener.use(submitHandler);
}
