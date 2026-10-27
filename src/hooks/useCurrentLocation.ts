import { useState } from 'react';
import * as Location from 'expo-location';

const TEMPO_LIMITE_MS = 20000; // 20 segundos

type Coordenadas = { latitude: number; longitude: number };

export function useCurrentLocation() {
  const [coords, setCoords] = useState<Coordenadas | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function buscar() {
    setCarregando(true);
    setErro(null);
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErro('Permissão de localização negada.');
        return;
      }

      // Corrida: ou o GPS responde, ou o relógio de 20s estoura primeiro
      const gps = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const relogio = new Promise<never>((_, rejeitar) => {
        timer = setTimeout(() => rejeitar(new Error('timeout')), TEMPO_LIMITE_MS);
      });

      const posicao = await Promise.race([gps, relogio]);
      setCoords({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      });
    } catch (e: any) {
      setErro(
        e?.message === 'timeout'
          ? 'O GPS demorou mais de 20s. Tente de novo em área aberta.'
          : 'Não consegui pegar a localização.'
      );
    } finally {
      if (timer) clearTimeout(timer);
      setCarregando(false); // nunca fica preso em "Obtendo..."
    }
  }

  function limpar() {
    setCoords(null);
  }

  return { coords, carregando, erro, buscar, limpar };
}
