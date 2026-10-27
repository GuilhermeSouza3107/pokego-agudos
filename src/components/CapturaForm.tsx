import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { CapturaRepository } from '../repository/CapturaRepository';
import { POKEMONS } from '../data/pokemons';

const repository = new CapturaRepository();

type Props = { onSaved: () => void };

export default function CapturaForm({ onSaved }: Props) {
  const [bairro, setBairro] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [cameraAberta, setCameraAberta] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const [permissao, pedirPermissao] = useCameraPermissions();
  const { coords, carregando, erro, buscar, limpar } = useCurrentLocation();

  async function abrirCamera() {
    if (!permissao?.granted) {
      const resposta = await pedirPermissao();
      if (!resposta.granted) {
        Alert.alert('Sem câmera', 'Precisamos da permissão da câmera para fotografar.');
        return;
      }
    }
    setCameraAberta(true);
  }

  async function tirarFoto() {
    try {
      const foto = await cameraRef.current?.takePictureAsync({ quality: 0.5 });
      if (foto) setFotoUri(foto.uri);
    } catch {
      Alert.alert('Ops', 'Não consegui tirar a foto.');
    } finally {
      setCameraAberta(false);
    }
  }

  async function capturar(nomePokemon: string) {
    if (!bairro.trim()) {
      Alert.alert('Bairro', 'Digite o bairro de Agudos primeiro.');
      return;
    }
    try {
      await repository.salvar({
        id: Date.now().toString(),
        pokemon: nomePokemon,
        bairro: bairro.trim(),
        photoUri: fotoUri,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Gotcha! 🎉', `${nomePokemon} capturado!`);
      setFotoUri(null);
      limpar();
      onSaved();
    } catch (e: any) {
      Alert.alert('Não deu', e.message);
    }
  }

  // Tela da câmera
  if (cameraAberta) {
    return (
      <View>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <TouchableOpacity style={styles.botao} onPress={tirarFoto}>
          <Text style={styles.botaoTexto}>📸 Tirar foto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const podeCapturar = fotoUri !== null || coords !== null;

  return (
    <View style={styles.card}>
      <Text style={styles.passo}>1. Onde você está?</Text>
      <TextInput
        style={styles.input}
        placeholder="Bairro de Agudos (ex: Centro)"
        value={bairro}
        onChangeText={setBairro}
      />

      <Text style={styles.passo}>2. Confirme o GPS</Text>
      <TouchableOpacity style={styles.botao} onPress={buscar} disabled={carregando}>
        <Text style={styles.botaoTexto}>📍 Pegar localização</Text>
      </TouchableOpacity>
      {carregando && <ActivityIndicator style={{ marginTop: 8 }} />}
      {coords && (
        <Text style={styles.ok}>
          GPS ok: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
        </Text>
      )}
      {erro && <Text style={styles.erro}>{erro}</Text>}

      <Text style={styles.passo}>3. Tire uma foto</Text>
      <TouchableOpacity style={styles.botao} onPress={abrirCamera}>
        <Text style={styles.botaoTexto}>📷 Abrir câmera</Text>
      </TouchableOpacity>
      {fotoUri && <Image source={{ uri: fotoUri }} style={styles.preview} />}

      <Text style={styles.passo}>4. Escolha o pokémon</Text>
      {podeCapturar ? (
        POKEMONS.map((p) => (
          <View key={p.nome} style={styles.linhaPokemon}>
            <Text style={styles.nomePokemon}>
              {p.emoji} {p.nome}
            </Text>
            <TouchableOpacity style={styles.botaoCapturar} onPress={() => capturar(p.nome)}>
              <Text style={styles.botaoTexto}>Capturar</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.dica}>Pegue o GPS ou tire uma foto para ver os pokémons por perto.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  passo: { fontSize: 16, fontWeight: 'bold', marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  botao: { backgroundColor: '#3b4cca', padding: 12, borderRadius: 8, alignItems: 'center' },
  botaoCapturar: { backgroundColor: '#e53935', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  camera: { height: 400, borderRadius: 12, overflow: 'hidden', marginBottom: 10 },
  preview: { width: '100%', height: 180, borderRadius: 8, marginTop: 8 },
  ok: { color: 'green', marginTop: 6 },
  erro: { color: 'crimson', marginTop: 6 },
  dica: { color: '#666' },
  linhaPokemon: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  nomePokemon: { fontSize: 16 },
});
