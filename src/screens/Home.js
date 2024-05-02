import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Avatar, Searchbar, IconButton } from 'react-native-paper';
import AnimatedLottieView from 'lottie-react-native';
import Empty from '../ghost.json';
import { API_KEY } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  Button,Dialog, Portal } from 'react-native-paper';
import { faSignOut,faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { auth, firestore } from '../../firebase';


const Home = () => {
const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [likedIds, setLikedIds] = useState([]);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [user,setUser]=useState("")


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const emailParts = storedUser.split('@');
        const emailPrefix = emailParts[0];
        setUser(emailPrefix)
  
        // Fetch liked recipe IDs from Firestore
        const likedSnapshot = await firestore.collection('liked').doc(emailPrefix).get();
        const likedData = likedSnapshot.data();
  
        if (likedData && likedData.likedId) {
       if(!likedData.likedId===""){
        const storedLikedIds = likedData.likedId.split(',');
        setLikedIds(storedLikedIds);
       }
        }
  
        // Fetch random recipes
        const response = await fetch(
          `https://api.spoonacular.com/recipes/random?number=30&limitLicense=true&apiKey=${API_KEY}`
        );
        const data = await response.json();
        setRecipes(data.recipes);
        console.log(storedUser)
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
        `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&apiKey=${API_KEY}`
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
  const handleSignOut = async () => {
    try {
      hideDialog()
      await AsyncStorage.removeItem('user');
      auth.signOut()
        .then(() => navigation.replace('Login'))
        .catch(error => alert(error.message));
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    }
  };
  const handleLike = async (recipeId) => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const emailParts = storedUser.split('@');
      const emailPrefix = emailParts[0];
  
      let newLikedIds = [...likedIds];
      const stringRecipeId = String(recipeId); 
  
      if (newLikedIds.includes(stringRecipeId)) {
        newLikedIds = newLikedIds.filter(id => id !== stringRecipeId);
      } else {
        newLikedIds.push(stringRecipeId);
      }
  
      await firestore.collection('liked').doc(emailPrefix).set({
        likedId: newLikedIds.join(',')
      });
  
      setLikedIds(newLikedIds);
      console.log('Recipe liked:', recipeId);
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };
  
  
  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeContainer} onPress={() => handleRecipePress(item)}>
      <ImageBackground source={{ uri: item.image }} style={styles.imageBackground}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
      <FontAwesomeIcon 
  size={25} 
  color={likedIds.includes(String(item.id)) ? 'red' : 'white'}
  style={{ borderColor: 'black', borderWidth: 1, borderRadius: 50 }}
  icon={faHeart} 
/>

    </TouchableOpacity>
        </View>
      </ImageBackground>
     
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
  
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
        <View style={{ marginHorizontal: 10 }}>
          <Text style={{color:'black'}}>{currentDate}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'black' }}>Hi, {user}</Text>

        </View>
        <TouchableOpacity 
  style={{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: 10, 
    borderRadius: 50 , 
    flexDirection: 'row', 
  }} 
  onPress={() => navigation.navigate('Liked')}
>
  <FontAwesomeIcon 
    size={25} 
    icon={faHeart} 
  />
</TouchableOpacity>

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
      <TouchableOpacity style={styles.signOutButton} onPress={showDialog}><Text><FontAwesomeIcon size={25} color='white' icon={faSignOut} /></Text></TouchableOpacity>

<Portal>
  <Dialog visible={visible} onDismiss={hideDialog}>
    <Dialog.Title>Alert</Dialog.Title>
    <Dialog.Content>
      <Text style={{ color: 'black', fontSize: 17 }}>Are you sure you want to logout?</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <TouchableOpacity onPress={hideDialog} style={styles.button}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={[styles.button, styles.buttonDanger]}>
        <Text style={[styles.buttonText,{color:'#4169e1'}]}>Yes</Text>
      </TouchableOpacity>
    </Dialog.Actions>
  </Dialog>
</Portal>
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
  signOutButton: {
    alignItems: 'center',
    backgroundColor: '#4169e1',
    margin: 25,
    borderRadius: 10,
    padding: 10,
    marginVertical:5,
    width:50,
    position:'absolute',
    right:0,
    bottom:10
    
  },
  signOutText: {
    fontSize: 18,
    color: 'white',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4169e1',
    backgroundColor:'#4169e1',
   
  },
  buttonText: {
    fontSize: 15,
    color:'white'
  },
  buttonDanger: {
    backgroundColor: '#e6e6fa', 
    borderColor: '#4169e1',
    color:'#4169e1'
  },
});

export default Home;
