import { Schema, model } from 'mongoose'
import { schemaOpts } from './mixins'


export interface ICoins {
  icon: string,
  title: string
}

const CoinsSchema = new Schema<ICoins>({
  icon: { type: String, required: false },
  title: { type: String, required: true },
}, schemaOpts)

const Coins = model<ICoins>('Coins', CoinsSchema)
export default Coins