import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 100,
    backgroundColor: "white"
  },
  texto: {
    fontWeight: "bold"
  },
  list: {
    width: "100%",
    marginTop: 10,
  },
  listItem: {
    fontSize: 16,
    padding: 5,
    backgroundColor: "#ddd",
    width: "100%",
    textAlign: "center",
    marginBottom: 5,
    borderRadius: 5,
  },
  picker: {
    backgroundColor: "red",
    color: "white",
    width: 250, 
    height: 60,
    margin: 10
  }
});