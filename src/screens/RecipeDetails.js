import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const RecipeDetails = ({ route }) => {
  const { recipe } = route.params;
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
       <Text style={styles.heading}>Recipe Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{recipe.title}</Text>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <Text style={styles.subtitle}>Ingredients:</Text>
        <View style={styles.card}>
          {recipe.extendedIngredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredientText}>
            <Icon name="arrow-forward-outline" size={15} color="black" />{' '}{ingredient.original}
            </Text>
          ))}
        </View>
        <Text style={styles.subtitle}>Instructions:</Text>
        <View style={styles.card}>
        <RenderHtml
          contentWidth={width}
          source={{ html: recipe.instructions }}
          style={styles.instructions}
        />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor:'#e6e6fa'
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign:'center',
    marginBottom:10
  },
  contentContainer: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ingredientText: {
    fontSize: 15,
    marginBottom: 5,
    color:'black'
  },
  instructions: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default RecipeDetails;
