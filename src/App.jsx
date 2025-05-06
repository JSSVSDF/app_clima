// console.log(import.meta.env.VITE_API_KEY);
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import { useState } from "react";

// ⚠️ Usa tu clave directamente para pruebas (luego puedes volver a usar import.meta.env)
const API_KEY = "f0ce0c2bc13045ba994190000250105"; // prueba directa
const BASE_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&lang=es&aqi=no&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: 0,
    condition: "",
    icon: "",
    conditionText: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ error: false, message: "" });

    if (!city.trim()) {
      setError({ error: true, message: "Ingrese una ciudad. Este campo es obligatorio." });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      });
    } catch (err) {
      setError({ error: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" align="center" gutterBottom>
      Clima en el mundo 
      </Typography>

      <Box component="form" sx={{ display: "grid", gap: 2 }} autoComplete="off" onSubmit={onSubmit}>
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />
        <Button type="submit" variant="contained" disabled={loading}
         sx={{ backgroundColor: "green", "&:hover": { backgroundColor: "darkgreen" } }}
         >
         
          {loading ? "Cargando..." : "Buscar"}
        </Button>
      </Box>

      {weather.city && (
        <Box sx={{ mt: 2, display: "grid", gap: 2, textAlign: "center" }}>
          <Typography variant="h4">
            {weather.city}, {weather.country}
          </Typography>
          <Box component="img" alt={weather.conditionText} src={weather.icon} sx={{ margin: "0 auto" }} />
          <Typography variant="h5">{weather.temp}°C</Typography>
          <Typography variant="h6">{weather.conditionText}</Typography>
        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
        Powered by:{" "}
        <a href="https://www.weatherapi.com/" title="Weather API">
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  );
}
