import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Captura } from '../types';

type Props = {
  capturas: Captura[];
  onDelete: (id: string) => void;
};

export default function CapturaList({ capturas, onDelete }: Props) {
  if (capturas.length === 0) {
    return <Text style={styles.vazio}>Nenhum pokémon capturado ainda.</Text>;
  }

  return (
    <View>
      {capturas.map((c) => (
        <View key={c.id} style={styles.item}>
          {c.photoUri ? (
            <Image source={{ uri: c.photoUri }} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.semFoto]}>
              <Text>sem foto</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{c.pokemon}</Text>
            <Text style={styles.info}>Bairro: {c.bairro}</Text>
            <Text style={styles.info}>
              {c.latitude !== null && c.longitude !== null
                ? `${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`
                : 'sem GPS'}
              {' · '}
              {new Date(c.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <TouchableOpacity style={styles.botaoExcluir} onPress={() => onDelete(c.id)}>
            <Text style={styles.excluirTexto}>DELETE</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  vazio: { textAlign: 'center', color: '#666', marginTop: 10 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 10, gap: 10 },
  foto: { width: 64, height: 64, borderRadius: 8 },
  semFoto: { backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  nome: { fontSize: 17, fontWeight: 'bold' },
  info: { fontSize: 12, color: '#555' },
  botaoExcluir: { backgroundColor: '#c62828', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  excluirTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
