import {useState} from "react";
import { TextInput, View, Image, Button, TouchableOpacity} from "react-native";
import { style } from "./style";
import { Ionicons } from "@expo/vector-icons"; 
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Home: undefined;
};

export default function Login() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Home">>();

  const [nome, setnome] = useState('');
  const [idade, setidade] = useState('');
  const [backgroundColor, setbackgroundColor] = useState('');

  const changeBackground = () => {
    setbackgroundColor((prevColor) => (prevColor == "black" ? "white" : "black"));
  };

  return (
    <View style={[style.main, {backgroundColor}]}>

      <TouchableOpacity onPress={changeBackground} style={style.icon}>
        <Ionicons name='moon' size={25} color={"red"}/>
      </TouchableOpacity>

      <View style={style.logo}>{/* imagem da logo */}
        <Image style={{width: 200, height: 200}}
        source={require("../../src/assets/Gorillaz.jpeg")}
        />
      </View>
  
      <View style={style.formulario}> {/* aqui vai ficar a interação */}
        <TextInput style={style.input} placeholder="Nome" placeholderTextColor={'black'} value={nome} onChangeText={setnome}/>
        <TextInput style={style.input} placeholder="Idade" placeholderTextColor={'black'} value={idade} onChangeText={setidade} keyboardType="numeric"/>

        <Button title="Entrar" onPress={() => navigation.navigate("Home")}/>
      </View>
    </View>
  );
}
