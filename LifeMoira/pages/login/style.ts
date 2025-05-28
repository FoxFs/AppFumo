import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    transform: [{translateX: 0}, {translateY: -150}]
  },
  formulario: {
    width: "90%",
    gap: 20,
    height: 50,
    paddingHorizontal: 15,
  },
  input: {
    backgroundColor: "white",
    height: 50,
    fontSize: 12,
    borderWidth: 1,
  },
  icon: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 20,
  }
});
