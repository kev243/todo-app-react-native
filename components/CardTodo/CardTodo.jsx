import { Image, Text, TouchableOpacity } from "react-native";
import checkImg from "../../assets/check.png";
import { s } from "./CardTodo.style";

export function CardTodo({ todo, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(todo)} style={s.card}>
      <Text
        style={[
          s.text,
          todo.isCompleted && { textDecorationLine: "line-through" },
        ]}
      >
        {todo.title}
      </Text>
      {todo.isCompleted && (
        <Image style={s.img} source={checkImg} resizeMode="contain" />
      )}
    </TouchableOpacity>
  );
}
