import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const IMAGE_API_URL = "http://localhost:3000/operate";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [operations, setOperations] = useState([]);

  const selectImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  const processImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: selectedImage,
        name: "image.jpg",
        type: "image/jpg",
      });
      formData.append("operations", JSON.stringify(operations));

      const response = await axios.post(IMAGE_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProcessedImage(response.data.url);
    } catch (error) {
      console.error(error);
      alert("Failed to process image!");
    }
  };

  const addOperation = (operation) => {
    setOperations([...operations, operation]);
  };

  const removeOperation = (index) => {
    setOperations([
      ...operations.slice(0, index),
      ...operations.slice(index + 1),
    ]);
  };

  return (
    <SafeAreaView>
      <ScrollView className=" p-3">
        {/* image */}
        <View className=" flex-row justify-evenly">
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className=" h-40 w-40 rounded-md"
            />
          )}
          {processedImage && (
            <Image source={{ uri: processedImage }} className=" h-40 w-40" />
          )}
        </View>

        {selectedImage && (
          <View className="">
            <Text className=" text-lg mt-2 uppercase font-semibold text-center underline">
              Operations:
            </Text>
            {operations.map((operation, index) => (
              <View
                key={index}
                className="  flex-row items-center justify-between"
              >
                <Text className=" font-bold uppercase text-xs tracking-wide">
                  {operation.type}
                </Text>
                <FontAwesome
                  name="remove"
                  size={20}
                  color="black"
                  onPress={() => removeOperation(index)}
                />
              </View>
            ))}

            {/* operation */}
            <View className=" space-y-4 mt-2">
              <Pressable
                className=" bg-gray-200 p-3 rounded-full max-w-fit items-center"
                onPress={() => addOperation({ type: "flipHorizontal" })}
              >
                <Text className=" uppercase font-bold tracking-widest">
                  Flip Horizontal
                </Text>
              </Pressable>

              <Pressable
                className=" bg-gray-200 p-3 rounded-full max-w-fit items-center "
                onPress={() => addOperation({ type: "flipVertical" })}
              >
                <Text className=" uppercase font-bold tracking-widest">
                  Flip Vertical
                </Text>
              </Pressable>

              <Pressable
                className=" bg-gray-200 p-3 rounded-full max-w-fit items-center "
                onPress={() => addOperation({ type: "rotateRight" })}
              >
                <Text className=" uppercase font-bold tracking-widest">
                  Rotate 90° Right
                </Text>
              </Pressable>

              <Pressable
                className=" bg-gray-200 p-3 rounded-full max-w-fit items-center "
                onPress={() => addOperation({ type: "rotateLeft" })}
              >
                <Text className=" uppercase font-bold tracking-widest">
                  Rotate 90° Left
                </Text>
              </Pressable>

              <Pressable
                className=" bg-gray-200 p-3 rounded-full max-w-fit items-center "
                onPress={() => addOperation({ type: "grayscale" })}
              >
                <Text className=" uppercase font-bold tracking-widest">
                  Grayscale
                </Text>
              </Pressable>

              <Pressable
                className=" bg-gray-200 p-3 rounded-full max-w-fit items-center "
                onPress={() =>
                  addOperation({ type: "resize", width: 500, height: 500 })
                }
              >
                <Text className=" uppercase font-bold tracking-widest">
                  Resize
                </Text>
              </Pressable>

              <Pressable
                className=" bg-gray-200 p-3 rounded-full max-w-fit items-center"
                onPress={() =>
                  addOperation({ type: "thumbnail", width: 100, height: 100 })
                }
              >
                <Text className=" uppercase font-bold tracking-widest">
                  Thumbnail
                </Text>
              </Pressable>
            </View>

            {/* operate */}
            <Pressable
              className=" bg-black p-3 rounded-full max-w-fit items-center mt-5"
              onPress={processImage}
            >
              <Text className=" uppercase font-bold tracking-widest text-white">
                Operate
              </Text>
            </Pressable>
          </View>
        )}

        {/* select an image */}
        <Pressable
          className=" bg-black p-3 rounded-full max-w-fit items-center mt-2 mb-10"
          onPress={selectImage}
        >
          <Text className=" uppercase font-bold tracking-widest text-white">
            Select an Image
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
