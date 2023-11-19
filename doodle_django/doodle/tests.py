from django.test import TestCase

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import UserFake

# Create your tests here.


class UserAuthenticationViewTest(APITestCase):

    def setUp(self):
        # Creare un utente fittizio per il test
        self.user = UserFake.objects.create(email='test@example.com')
        self.user.save()

    def test_user_authentication_success(self):
        url = reverse('user_authentication')  # name dell' URL nel file urls.py
        email = 'test@example.com'

        # Richiesta GET con l'email nell'url
        response = self.client.get(url, {'email': email})

        # Verifica che la risposta abbia uno status code 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verifica che il messaggio nella risposta sia corretto
        self.assertEqual(response.data['message'], 'User authenticated successfully')

    def test_user_authentication_failure(self):
        url = reverse('user_authentication') 
        email = 'nonexistent@example.com'

        # Richiesta GET con un'email che non è presente nel database
        response = self.client.get(url, {'email': email})

        # Verifica che la risposta abbia uno status code 401 (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Verifica che il messaggio nella risposta sia corretto
        self.assertEqual(response.data['message'], 'Invalid credentials')



class UserRegistrationViewTest(APITestCase):

    def test_user_registration_success(self):
        url = reverse('register_user')
        # Dati inseriti nel form per la registrazione 
        data = {'name': 'Anna', 'surname': 'Bianchi', 'email': 'test@example.com' }

        # Richiesta POST con i dati dell'utente
        response = self.client.post(url, data)

        # Verifica che la risposta abbia uno status code 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verifica che l'utente sia stato creato correttamente nel database
        user_exists = UserFake.objects.filter(email='test@example.com').exists()
        self.assertTrue(user_exists)
