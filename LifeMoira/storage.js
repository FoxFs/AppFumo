import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "user_vicios"

export const saveVicio = async (vicio) => {
  try {
    const storageVice = await AsyncStorage.getItem(STORAGE_KEY);
    let vicios = storageVice ? JSON.parse(storageVice) : [];

    const index = vicios.findIndex(v => v.nome === vicio.nome);

    if (index !== -1) {
      vicios[index].ultima_vez = new Date().toISOString();
      vicios[index].vezes_evitadas += 1;
    } else {
      vicios.push({nome: vicio.nome, ultima_vez: new Date().toISOString(), vezes_evitadas: 1});
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(vicios));

  } catch (error) {
    console.error("Erro to save vice, try again!", error)
  }
};

export const pegarVicio = async () => {
  try {
    const storageVice = await AsyncStorage.getItem(STORAGE_KEY)
    return storageVice ? JSON.parse(storageVice) : [];

  } catch (error) {
    console.error("Error to add vice", error);
    return [];

  }
};