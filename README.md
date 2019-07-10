# ETH -> EUR Exchange


# Oráculo

El sistema usa un [oráculo](./contracts/EUROracle.sol) que da la tasa de cambio ETH->EUR y viceversa.
Para su implementación se ha hecho uso de [oraclize](https://docs.provable.xyz/), de forma que se emite un evento que
es capturado por esta empresa, y ejecuta la llamada remota a una URL data y extrae del JSON de respuesta el elemento
que simboliza la tasa de cambio. Una vez conseguido dicho elemento ejecuta la función del
 contrato ``__callback(bytes32,string)``, en la cual se obtiene el resultado y se parsea el número en céntimos de Euro.
 
Lamentablemente no es posible probar esta funcionalidad en Ganache, por lo que he realizado pruebas en la testnet
de Rinkeby. [Aquí](https://rinkeby.etherscan.io/address/0xb13705ee03f946ac37a1578234017f555fc1f8bb) podemos ver todas
las transacciones del contrato, y resultan particularmente interesantes las siguientes:

- [Transacción](https://rinkeby.etherscan.io/tx/0x72a2f30d2a8b14fede0f55f07c2d0b6e34a94efe4500438ce803c07dbcf03c51) de
solicitud de oraclize a Provable para acceder a la URL.
- [Transacción](https://rinkeby.etherscan.io/tx/0x28a9afa7e2844c2e0fafa39c6a7204329612db4ba7a5b9f2f072ce2c6ee798b0) de
vuelta que ejecuta la función ``__callback``.

Es interesante mencionar que el contrato está disponible en ``EthPM`` bajo el nombre de ``oraclize-api``. Sin embargo
dicho contrato está preparado para ser compilado con una versión de solidity bastante inferior a la usada. Es por ello
que finalmente se ha decidido copiar el contrato [UsingOraclize.sol](./contracts/UsingOraclize.sol). En caso contrario
sencillamente se habrían declarado las dependencias en ``ethpm.json`` de la siguiente manera:

```json
{
  ...
  
  "dependencies": {
    "oraclize-api": "^1.0.0"
  }
}
```

Tras ello hubiese bastado con ejecutar ``truffle install`` para crear el directorio `installed_contracts/` y así poder 
directamente usar el contrato.

