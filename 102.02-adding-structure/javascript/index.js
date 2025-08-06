import { contactsHook } from "./listeners/contacts-hook.listener";
import { submitHandler } from "./listeners/submit-handler.listener";
import { spaceConfig } from "./listeners/configure-space.listener";

export default function (listener) {
  // Configure the Space with the SpaceConfigure Plugin
  listener.use(spaceConfig);

  // Build Record Hook for the contacts sheet
  listener.use(contactsHook);
  
  // Handle Submit Action with JobHandler Plugin
  listener.use(submitHandler);
}
