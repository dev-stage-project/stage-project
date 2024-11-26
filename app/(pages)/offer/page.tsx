"use client";
import React, { useState } from 'react';

const VehicleOfferForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    country: '',
    vehicleType: 'Car', // Added vehicleType field with default value
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    color: '',
    transmission: '',
    photos: [] as File[],  // Modifier photos pour être un tableau de fichiers
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        photos: Array.from(e.target.files),  // Mettre à jour les photos avec les fichiers sélectionnés
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = document.cookie.split('=')[1];  // Assumes the token is stored as a cookie

      const form = new FormData();
      // Ajouter les autres champs du formulaire
      Object.keys(formData).forEach((key) => {
        if (key !== 'photos') {
          form.append(key, formData[key as keyof typeof formData]);
        }
      });

      // Ajouter les photos à la FormData
      formData.photos.forEach((file) => {
        form.append('photos', file);
      });

      const response = await fetch('/api/vehicle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Offre de véhicule créée avec succès!');
        setFormData({
          title: '',
          description: '',
          price: '',
          city: '',
          country: '',
          vehicleType: 'Car', // Reset vehicleType to default
          model: '',
          year: '',
          mileage: '',
          fuelType: '',
          color: '',
          transmission: '',
          photos: [],
        });
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi de la requête');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Créer une offre de véhicule</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        
        <label>
          Titre:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>
        
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Prix:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Ville:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Pays:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Type de véhicule:
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          >
            <option value="Car">Voiture</option>
            <option value="Truck">Camion</option>
            <option value="Motorcycle">Moto</option>
            <option value="Van">Van</option>
            <option value="Bicycle">Vélo</option>
            <option value="Boat">Bateau</option>
          </select>
        </label>

        <label>
          Modèle:
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Année:
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Kilométrage:
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Type de carburant:
          <input
            type="text"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Couleur:
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Transmission:
          <input
            type="text"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            required
            style={{ color: 'black' }} // Texte en noir
          />
        </label>

        <label>
          Photos:
          <input
            type="file"
            name="photos"
            multiple
            onChange={handleFileChange}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Créer l\'offre'}
        </button>
      </form>
    </div>
  );
};

export default VehicleOfferForm;
