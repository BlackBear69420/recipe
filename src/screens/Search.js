import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList,TouchableOpacity,ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Search = ({ route }) => {
    const { searchResults } = route.params;
    const navigation = useNavigation();

    const handleRecipePress = async (recipeId) => {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=732190a0a9474665ae4c0449cc40f0cc`);
            const data = await response.json();
            navigation.navigate('RecipeDetails', { recipe: data });
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeContainer} onPress={() => handleRecipePress(item.id)}>
      <ImageBackground source={{ uri: item.image }} style={styles.imageBackground}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
            <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
       <Text style={styles.heading}>Search Results</Text>
      </View>
      <FlatList
        data={searchResults}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor:'#e6e6fa',
    width:'100%'
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black'
  },
  backButton: {
    marginRight: 10,
  },
  imageBackground: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 30,
    marginVertical:20,
  },
  recipeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default Search;
