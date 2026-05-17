import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  icon: string;
  iconColor: string;
  label: string;
  onPress?: () => void;
};

export default function SocialButton({ icon, iconColor, label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={onPress}>
      <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
      <Text className="text-[15px] font-[Poppins-Medium] text-text-primary">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  icon: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    width: 24,
    textAlign: "center",
  },
});
