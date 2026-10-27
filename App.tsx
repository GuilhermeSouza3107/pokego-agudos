import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CapturaForm from './src/components/CapturaForm';
import CapturaList from './src/components/CapturaList';
import { CapturaRepository } from './src/repository/CapturaRepository';
import { Captura } from './src/types';

const repository = new CapturaRepository();

export default function App() {
  const [capturas, setCapturas] = useState<Captura[]>([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    try {
      setCapturas(await repository.listar());
    } catch {
      setCapturas([]);
    } finally {
      setCarregando(false); // evita tela de carregando infinita
    }
  }, []);

  // Ao abrir o app, lê tudo que foi salvo antes
  useEffect(() => {
    recarregar();
  }, [recarregar]);

  async function excluir(id: string) {
    await repository.remover(id);
    await recarregar(); // recarrega pra mostrar a verdade
  }

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>PokéGo Agudos 🔴</Text>

        <CapturaForm onSaved={recarregar} />

        <Text style={styles.subtitulo}>Meus pokémons</Text>
        {carregando ? (
          <ActivityIndicator />
        ) : (
          <CapturaList capturas={capturas} onDelete={excluir} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f2f2f7' },
  conteudo: { padding: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
