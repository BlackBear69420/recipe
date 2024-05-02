import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity,ActivityIndicator } from 'react-native';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../../firebase';
import { faSignOut,faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


const RecipeDetails = ({ route }) => {
  const { recipe } = route.params;
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [likedIds, setLikedIds] = useState(null);

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const emailParts = storedUser.split('@');
        const emailPrefix = emailParts[0];
  
        const likedSnapshot = await firestore.collection('liked').doc(emailPrefix).get();
        const likedData = likedSnapshot.data();
  
        if (likedData && likedData.likedId) {
          const storedLikedIds = likedData.likedId.split(',');
          setLikedIds(storedLikedIds);
          console.log(storedLikedIds)
          console.log(recipe.id)
        }
      } catch (error) {
        console.error('Error fetching liked recipes:', error);
      }
    };
  
    fetchLikedRecipes();
  }, []);
  
  if (likedIds === null) {
    // Liked recipes are being fetched
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const handleLike = async (recipeId) => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const emailParts = storedUser.split('@');
      const emailPrefix = emailParts[0];
  
      let newLikedIds = [...likedIds];
      const stringRecipeId = String(recipeId); // Convert recipeId to string
  
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
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
       <Text style={styles.heading}>Recipe Details</Text>
       <TouchableOpacity onPress={() => handleLike(recipe.id)}>
      <FontAwesomeIcon 
  size={25} 
  color={likedIds.includes(String(recipe.id)) ? 'red' : 'grey'} 
  style={{ borderColor: 'black', borderWidth: 1, borderRadius: 50 }}
  icon={faHeart} 
/>
    </TouchableOpacity>
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
    backgroundColor:'#e6e6fa',
    justifyContent:'space-between'
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
