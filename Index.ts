import { ApolloServer, gql } from 'apollo-server';
const fetch = require('node-fetch');
import { fetchAssets, fetchHistoricData } from './graphQLModules/FetchData';

const typeDefs = gql`
type Assets {
  asset_id: String!
  name: String!
  price_usd: String!
  data_trade_start: String
  icon_url: String
}

type History {
  time_period_start: String!
  rate_close: Float!
}

type Query {
    assets: [Assets!]!
    historicData(ASSET_ID:String, PERIOD_ID:String, TIME_START:String): [History!]
}
`;

const resolvers: any = {
  Query: {
    assets: fetchAssets,
    historicData: fetchHistoricData,
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

// The listen method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})