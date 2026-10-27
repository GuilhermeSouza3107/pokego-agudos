import AsyncStorage from '@react-native-async-storage/async-storage';
import { Captura } from '../types';

// Chave nova (não reaproveitei a do Agudos Connect de propósito)
const CHAVE = '@pokego-agudos:capturas';

export class CapturaRepository {
  async listar(): Promise<Captura[]> {
    const texto = await AsyncStorage.getItem(CHAVE);
    return texto ? JSON.parse(texto) : [];
  }

  async salvar(captura: Captura): Promise<void> {
    // Regra de negócio: só salva com foto OU com GPS
    const temFoto = captura.photoUri !== null;
    const temGps = captura.latitude !== null && captura.longitude !== null;
    if (!temFoto && !temGps) {
      throw new Error('Tire uma foto ou pegue o GPS antes de capturar!');
    }

    const lista = await this.listar();
    lista.unshift(captura); // mais novo primeiro
    await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  async remover(id: string): Promise<void> {
    const lista = await this.listar();
    const novaLista = lista.filter((item) => item.id !== id);
    await AsyncStorage.setItem(CHAVE, JSON.stringify(novaLista));
  }
}
