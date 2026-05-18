import SocialButton from "@/components/SocialButton";
import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useSSO } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function handleSignIn() {
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    setEmailError("");
    if (!isLoaded) return;

    setLoading(true);
    try {
      await signIn!.create({ identifier: email });
      await signIn!.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: signIn!.supportedFirstFactors!.find(
          (f) => f.strategy === "email_code",
        )!.emailAddressId!,
      });
      setModalVisible(true);
    } catch (err: any) {
      setEmailError(err?.errors?.[0]?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(code: string) {
    if (!isLoaded) return false;
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "email_code",
        code,
      });
      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        router.replace("/");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async function handleResend() {
    if (!isLoaded) return;
    const factor = signIn!.supportedFirstFactors!.find(
      (f) => f.strategy === "email_code",
    );
    if (!factor) return;
    await signIn!.prepareFirstFactor({
      strategy: "email_code",
      emailAddressId: factor.emailAddressId!,
    });
  }

  async function handleGoogle() {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const redirectUrl = Linking.createURL("oauth-callback");
      console.log("[Google SSO] redirectUrl:", redirectUrl);
      const { createdSessionId, setActive: setSSOSession } = await startSSOFlow(
        {
          strategy: "oauth_google",
          redirectUrl,
        },
      );
      console.log("[Google SSO] createdSessionId:", createdSessionId);
      if (createdSessionId) {
        await setSSOSession!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleFacebook() {
    if (facebookLoading) return;
    setFacebookLoading(true);
    try {
      const redirectUrl = Linking.createURL("oauth-callback");
      const { createdSessionId, setActive: setSSOSession } = await startSSOFlow(
        {
          strategy: "oauth_facebook",
          redirectUrl,
        },
      );
      if (createdSessionId) {
        await setSSOSession!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("Facebook sign-in error:", err);
    } finally {
      setFacebookLoading(false);
    }
  }

  async function handleApple() {
    if (appleLoading) return;
    setAppleLoading(true);
    try {
      const redirectUrl = Linking.createURL("oauth-callback");
      const { createdSessionId, setActive: setSSOSession } = await startSSOFlow(
        {
          strategy: "oauth_apple",
          redirectUrl,
        },
      );
      if (createdSessionId) {
        await setSSOSession!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("Apple sign-in error:", err);
    } finally {
      setAppleLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          {/* Back button */}
          <TouchableOpacity
            className="mt-2 mb-6 w-10 h-10 items-center justify-center"
            onPress={() => router.back()}
          />

          {/* Title */}
          <Text className="text-[28px] font-[Poppins-Bold] text-text-primary mb-1">
            Welcome back
          </Text>
          <Text className="body-medium text-text-secondary mb-6">
            Continue your language journey ✨
          </Text>

          {/* Mascot */}
          <View className="items-center mb-6">
            <Image
              source={images.mascotAuth}
              className="w-[140px] h-[140px]"
              style={styles.mascot}
            />
          </View>

          {/* Email field */}
          <View className="border-[1.5px] border-border rounded-[14px] px-4 py-3 bg-background">
            <Text className="text-[12px] font-[Poppins-Medium] text-text-secondary mb-1">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
          {emailError ? (
            <Text className="text-[12px] font-[Poppins-Medium] text-error mt-1 ml-1">
              {emailError}
            </Text>
          ) : null}

          {/* Sign In button */}
          <TouchableOpacity
            className="bg-lingua-purple rounded-[14px] py-[18px] items-center mt-6"
            activeOpacity={0.85}
            onPress={handleSignIn}
          >
            <Text className="text-[17px] font-[Poppins-SemiBold] text-white">
              {loading ? "Sending code..." : "Log In"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center gap-3 my-5">
            <View className="flex-1 h-px bg-border" />
            <Text className="body-small text-text-secondary">
              or continue with
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Social buttons */}
          <View className="gap-3">
            <SocialButton
              icon="G"
              iconColor="#ea4335"
              label="Continue with Google"
              onPress={handleGoogle}
            />
            <SocialButton
              icon="f"
              iconColor="#1877f2"
              label="Continue with Facebook"
              onPress={handleFacebook}
            />
            <SocialButton
              icon="⌘"
              iconColor="#000000"
              label="Continue with Apple"
              onPress={handleApple}
            />
          </View>

          {/* Sign up link */}
          <View className="flex-row justify-center mt-8 mb-4">
            <Text className="body-medium text-text-secondary">
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="body-medium text-lingua-purple font-[Poppins-SemiBold]">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <VerificationModal
        visible={modalVisible}
        email={email}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    flexGrow: 1,
  },
  mascot: {
    resizeMode: "contain",
  },
  input: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#0d132b",
    padding: 0,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
});
