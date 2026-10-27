# PokéGo Agudos 🔴

App mobile (Expo + React Native + TypeScript) feito em aula. Tema livre: um "Pokémon Go" dos bairros de Agudos.
O usuário escolhe o bairro, confirma o GPS, tira uma foto e captura um pokémon da lista. Tudo fica salvo no celular.

## O que cada registro guarda
`id`, `pokemon`, `bairro`, `photoUri` (ou null), `latitude`/`longitude` (ou null) e `createdAt` (texto ISO).

## Telas
- **Formulário de captura**: bairro, botão de GPS, câmera, lista de pokémons com botão "Capturar".
- **Lista de capturados**: foto, pokémon, bairro, coordenadas, data e botão de excluir.
(Tudo em uma única tela rolável, no `App.tsx`.)

## Regra de aceite
Só salva se tiver **foto OU localização** (igual a um check-in). Sem nenhum dos dois, o app avisa.

## Requisitos atendidos
- Foto: permissão tratada, preview e erros tratados
- GPS: permissão, coordenadas e limite de 20s
- Persistência: classe `CapturaRepository` com AsyncStorage
- Lista sobrevive ao fechar o app
- Excluir registro

## Estrutura
```
App.tsx
src/
  types.ts
  data/pokemons.ts
  hooks/useCurrentLocation.ts
  repository/CapturaRepository.ts
  components/CapturaForm.tsx
  components/CapturaList.tsx
```

## Reaproveitado do Agudos Connect
Nenhum arquivo copiado. A ideia do Repository e da regra "foto OU GPS" segue o mesmo padrão, mas com chave de storage e tipo novos.

## Como rodar
```bash
npm install
npx expo start
```
Abra no celular com o app Expo Go (escaneie o QR code).

## Prints
<img width="451" height="906" alt="image" src="https://github.com/user-attachments/assets/6b8a9843-6760-4874-b0c4-24fd9f7bab57" />
<img width="448" height="884" alt="image" src="https://github.com/user-attachments/assets/aa18bf94-f721-4669-b025-c1502940e422" />
<img width="460" height="865" alt="image" src="https://github.com/user-attachments/assets/a7ae9e54-4bb3-4166-95c5-397417b71238" />
<img width="460" height="873" alt="image" src="https://github.com/user-attachments/assets/f10ed5c4-c244-49f7-8fc2-8b9fe2ecde55" />


## Limitação conhecida
A foto fica no cache do app; se o sistema limpar o cache, o registro continua, mas a imagem pode sumir.
