import { View, Text, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./style";
import { StackNavigationProp } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import viciosData from "../../vicios.json";

type RootStackParamList = {
  Login: undefined;
};

interface ViciosRegistrados {
  nome: string;
  data: Date;
}

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Login">>();

  const [vicio, setVicio] = useState("");
  const [historico, setHistorico] = useState<ViciosRegistrados[]>([]);
  const [tempoSalvo, setTempoSalvo] = useState(0);
  const [dataUltimaVez, setDataUltimaVez] = useState<Date>(new Date());
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    carregarHistorico()
  }, [])

  const CalcularDiasSemVicio = (data: Date | undefined) => {
    if (!data) return 0;
    const agora = new Date()
    const dias = agora.getTime() - data.getTime();
    return Math.floor(dias / (1000 * 60 * 60 * 24));
  }

  const carregarHistorico = async () => {
    try {
      const data = await AsyncStorage.getItem("historico");
      if (data) {
        const historicoSalvo = JSON.parse(data);
        setHistorico(historicoSalvo);
      }

      const tempo = await AsyncStorage.getItem("tempoSalvo")
      if (tempo) {
        setTempoSalvo(parseFloat(tempo))
      }
    } catch (error) {
      console.error("Erro ao carregar o historico: ", error);
    }
  };

  const salvarHistorico = async (novoHistorico: ViciosRegistrados[], novoTempo: number) => {
    try {
      await AsyncStorage.setItem("historico", JSON.stringify(novoHistorico));
      await AsyncStorage.setItem("tempoSalvo", novoTempo.toString());
    } catch (error) {
      console.error("Erro to save historico", error)
    }
  }

  const adicionarVicio = () =>{
    if (!vicio) {
      alert("Por favor, escolha um vicio antes de prosseguir..")
      return;
    }

    const found = viciosData.vicios.find((item) => item.nome.toLowerCase() === vicio.toLowerCase());

    if (!found) {
      alert("Este vicio não existe no nosso historico")
      return;
    }

    const diasSemVicio = CalcularDiasSemVicio(dataUltimaVez)
    const vidaSalva = (diasSemVicio * found.perda_minutos_por_evento);

    const novoHistorico = [...historico, {nome:vicio, data: dataUltimaVez }];
    const novoTempo = tempoSalvo + vidaSalva;

    setHistorico(novoHistorico);
    setTempoSalvo(novoTempo);
    setVicio("");

    salvarHistorico(novoHistorico, novoTempo);
  };

  const removerVicio = (nomeVicio: string) => {
    Alert.alert(
      "Remover vício",
      `Tem certeza que deseja remover "${nomeVicio}" do histórico?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: () => {
            const novoHistorico = historico.filter((item) => item.nome !== nomeVicio);

            // Recalcula o tempo salvo ao remover
            const minutosRemovidos = historico.find((item) => item.nome === nomeVicio);
            if (minutosRemovidos) {
              const found = viciosData.vicios.find((v) => v.nome === nomeVicio);
              if (found) {
                const diasSemVicio = CalcularDiasSemVicio(minutosRemovidos.data);
                const minutosRecuperados = diasSemVicio * found.perda_minutos_por_evento;
                setTempoSalvo(tempoSalvo - minutosRecuperados);
              }
            }

            setHistorico(novoHistorico);
            salvarHistorico(novoHistorico, tempoSalvo);
          },
        },
      ]
    );
  };


  return (
    <View style={styles.main}>
      
      <Text style={styles.texto}>Bem-vindo</Text>
      <Text>Escolha um vicio:</Text>

      <Picker
        selectedValue={vicio}
        onValueChange={(itemValue) => setVicio(itemValue)}
        style={styles.picker}
        enabled={vicio === ""}
      >
        <Picker.Item label="Escolha um vício..." value=""/>
        {viciosData.vicios.map((item) => (
          <Picker.Item key={item.nome} label={item.nome} value={item.nome} />
        ))}
      </Picker>

      <Text>Ultima vez que você uso:</Text>
      <Button title="Escolher Data" onPress={() => setShowDate(true)}/>
      {showDate && (
        <DateTimePicker
          value={dataUltimaVez}
          mode="date"
          display="default"
          onChange={(_, date)=> {
            setShowDate(false)
            if (date){
              setDataUltimaVez(date)
            }
          }}
        />
      )}
      
      <Button title="add" onPress={adicionarVicio}/>
      <Text>Tempo de vida salvo: {(tempoSalvo / (60 * 24 * 365)).toFixed(2)} anos</Text>
      
      <FlatList
        data={historico}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => removerVicio(item.nome)}>
            <Text style={styles.listItem}>
              {item.nome} - <Text>Última vez:</Text> {new Date(item.data).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />

      <Button title="Voltar" onPress={() => navigation.navigate("Login")}/>
    </View>
  );
}
