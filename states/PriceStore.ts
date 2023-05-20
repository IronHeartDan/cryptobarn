import { action, makeAutoObservable } from 'mobx';

class PriceStore {
  private static instance: PriceStore;
  btcPrice: string = '';
  usdtPrice: string = '';

  constructor() {
    makeAutoObservable(this)
    this.initialFetch()
    this.startMonitoring()
  }

  public static getInstance(): PriceStore {
    if (!PriceStore.instance) {
      PriceStore.instance = new PriceStore();
    }
    return PriceStore.instance;
}

  initialFetch = action(async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
      const data = await response.json();
      const price = data.tether.usd;
      this.usdtPrice = price;
    } catch (error) {
      console.error('Error fetching USDT price:', error);
    }
  })

  startMonitoring = action(async () => {
    // Establish WebSocket connection
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');
    // Handle socket open event
    ws.onopen = () => {
      // Subscribe to BTC/USDT ticker price updates
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: ['btcusdt@ticker'],
        id: 1
      }));

      // Subscribe to USDT/USDT ticker price updates
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: ['usdtusd@ticker'],
        id: 2
      }));
    };

    // Handle incoming WebSocket messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.s === 'BTCUSDT') {
        this.setBtcPrice(data.c)
      } else if (data.s === 'USDTUSDT') {
        this.setUsdtPrice(data.c)
      }
    };
  })

  setBtcPrice = action((price: string) => {
    this.btcPrice = price;
  })

  setUsdtPrice = action((price: string) => {
    this.usdtPrice = price;
  })
}

const priceStore = PriceStore.getInstance()
export default priceStore;
