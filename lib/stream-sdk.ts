/**
 * Conditional wrapper for @stream-io/video-react-native-sdk.
 * Catches the missing native module error so the app can still run
 * in Expo Go (where react-native-webrtc isn't available).
 */

export let StreamVideo: any = null;
export let StreamCall: any = null;
export let StreamVideoClient: any = null;
export let useCallStateHooks: any = null;

 
try {
  const sdk = require("@stream-io/video-react-native-sdk");
  StreamVideo = sdk.StreamVideo;
  StreamCall = sdk.StreamCall;
  StreamVideoClient = sdk.StreamVideoClient;
  useCallStateHooks = sdk.useCallStateHooks;
} catch {
  console.warn(
    "Stream Video SDK not available. Audio calls require a development build.",
  );
}

export const streamAvailable = !!StreamVideoClient;
