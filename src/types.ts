// Cada pokémon capturado vira um registro assim.
// photoUri e coordenadas podem ser null: a câmera e o GPS podem falhar,
// e o registro continua válido se tiver pelo menos um dos dois.
export type Captura = {
  id: string;
  pokemon: string;
  bairro: string;
  photoUri: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string; // texto ISO (Date quebra no JSON)
};
