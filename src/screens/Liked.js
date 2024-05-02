import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_KEY } from '../../config';
import { firestore } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Liked = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null);
  const [recipeInfo, setRecipeInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserFromStorage = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const emailParts = storedUser.split('@');
        const emailPrefix = emailParts[0];

        const docSnapshot = await firestore
          .collection('liked')
          .doc(emailPrefix)
          .get();

        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          setUserData(data);
        } else {
          console.log('No such document!');
        }
      }
    } catch (error) {
      console.error('Error getting user from AsyncStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getUserFromStorage();
    }
  }, [isFocused, getUserFromStorage]);

  useEffect(() => {
    const getRecipeInfo = async () => {
      try {
        if (userData && userData.likedId) {
          setLoading(true);
          const response = await fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${userData.likedId}&apiKey=${API_KEY}`);
          const data = await response.json();
          setRecipeInfo(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching recipe information:', error);
        setLoading(false);
      }
    };

    if (userData) {
      getRecipeInfo();
    }
  }, [userData]);

  const renderRecipeInfo = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!recipeInfo) {
      return <Text>No liked recipes found.</Text>;
    }

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
      <FlatList
        data={recipeInfo}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  const handleRecipePress = async (recipeId) => {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`);
      const data = await response.json();
      navigation.navigate('RecipeDetails', { recipe: data });
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.heading}>Liked</Text>
      </View>
      {renderRecipeInfo()}
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
    backgroundColor: '#e6e6fa',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
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
    marginVertical: 20,
  },
  recipeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default Liked;
