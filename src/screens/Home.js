import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Searchbar, IconButton } from 'react-native-paper';
import AnimatedLottieView from 'lottie-react-native';
import Empty from '../ghost.json';

const Home = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          'https://api.spoonacular.com/recipes/random?number=30&limitLicense=true&apiKey=732190a0a9474665ae4c0449cc40f0cc'
        );
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();

    setCurrentDate(formatDate(new Date()));
  }, []);

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetails', { recipe: searchResults.length > 0 ? recipe : recipes.find(r => r.id === recipe.id) });
  };

  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&apiKey=732190a0a9474665ae4c0449cc40f0cc`
      );
      const data = await response.json();
      setSearchResults(data.results);
      console.log(searchResults)
      if (data.results.length === 0) {
        alert('No recipes found.');
      } else {
        console.log('Search results:', data.results);
        setTimeout(() => {
          navigation.navigate('Search', { searchResults: data.results });
        }, 200);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  const filteredRecipes = selectedCategory ? recipes.filter(recipe => recipe[selectedCategory.toLowerCase()]) : recipes;

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeContainer} onPress={() => handleRecipePress(item)}>
      <ImageBackground source={{ uri: item.image }} style={styles.imageBackground}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
        <View style={{ marginHorizontal: 10 }}>
          <Text>{currentDate}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'black' }}>Hi, Sumit</Text>
        </View>
      </View>
      <View style={{ alignItems: 'center', marginVertical: 10, flexDirection: 'row' }}>
        <Searchbar
          style={{ backgroundColor: '#dcdcdc', flex: 1, }}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <IconButton
          icon="magnify"
          iconColor='white'
          onPress={handleSearch}
          style={{backgroundColor:'#4169E1',}}
        />
      </View>
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free'].map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryItem, selectedCategory === category && { backgroundColor: 'lightblue', color: 'black' }]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        {filteredRecipes?.length === 0 || null ? (
          <View style={styles.loadingContainer}>
            <AnimatedLottieView
              source={Empty}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
            <Text style={styles.loadingText}>No Data to show..</Text>
            <Text style={styles.loadingText}>Please select a different category</Text>
          </View>
        ) : (
            <FlatList
              data={filteredRecipes}
              renderItem={renderRecipeItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          )}


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  listContainer: {
    padding: 10,
  },
  recipeContainer: {
    marginVertical: 30,
    borderRadius: 10,
    overflow: 'hidden',
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
  categoryItem: {
    backgroundColor: '#000',
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  loadingText: {
    color: 'black',
    fontSize: 18,
    alignSelf: 'center',
  },
});

export default Home;
