import SocialButton from "@/components/SocialButton";
import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useSignUp, useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import type { Href } from "expo-router";
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

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  async function handleSignUp() {
    const next = { email: "", password: "" };
    if (!email) next.email = "Email is required.";
    if (password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (next.email || next.password) return;
    if (!signUp) {
      setErrors({
        email: "Authentication not ready. Please try again.",
        password: "",
      });
      return;
    }

    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) {
      setErrors({
        email: error.message ?? "",
        password: "",
      });
      return;
    }

    const sendResult = await signUp.verifications.sendEmailCode();
    if (sendResult.error) {
      setErrors({
        email: sendResult.error.message ?? "",
        password: "",
      });
      return;
    }

    setModalVisible(true);
  }

  async function handleVerify(code: string) {
    if (!signUp) return false;
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return false;

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as Href);
        },
      });
    }
    return true;
  }

  async function handleResend() {
    if (!signUp) throw new Error("Authentication not ready. Please try again.");
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) throw new Error(error.message ?? "Failed to resend code");
  }

  async function handleGoogle() {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const redirectUrl = Linking.createURL("oauth-callback");
      const { createdSessionId, setActive: setSSOSession } = await startSSOFlow(
        {
          strategy: "oauth_google",
          redirectUrl,
        },
      );
      if (createdSessionId) {
        await setSSOSession!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("Google sign-up error:", err);
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
      console.error("Facebook sign-up error:", err);
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
      console.error("Apple sign-up error:", err);
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
            Create your account
          </Text>
          <Text className="body-medium text-text-secondary mb-6">
            Start your language journey today ✨
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
          {errors.email ? (
            <Text className="text-[12px] font-[Poppins-Medium] text-error mt-1 ml-1">
              {errors.email}
            </Text>
          ) : null}

          {/* Password field */}
          <View className="border-[1.5px] border-border rounded-[14px] px-4 py-3 bg-background mt-3">
            <Text className="text-[12px] font-[Poppins-Medium] text-text-secondary mb-1">
              Password
            </Text>
            <View className="flex-row items-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
              >
                <Text className="text-[18px] text-text-secondary">
                  {showPassword ? "🙈" : "👁"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {errors.password ? (
            <Text className="text-[12px] font-[Poppins-Medium] text-error mt-1 ml-1">
              {errors.password}
            </Text>
          ) : null}

          {/* Sign Up button */}
          <TouchableOpacity
            className="bg-lingua-purple rounded-[14px] py-[18px] items-center mt-6"
            activeOpacity={0.85}
            onPress={handleSignUp}
          >
            <Text className="text-[17px] font-[Poppins-SemiBold] text-white">
              {fetchStatus === "fetching" ? "Signing up..." : "Sign Up"}
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

          {/* Sign in link */}
          <View className="flex-row justify-center mt-8 mb-4">
            <Text className="body-medium text-text-secondary">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="body-medium text-lingua-purple font-[Poppins-SemiBold]">
                Log in
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
