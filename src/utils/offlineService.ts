// offlineService.ts

import NetInfo from '@react-native-community/netinfo';

let isConnected: boolean = false;

NetInfo.fetch().then(state => {
  isConnected = state.isConnected??true;
});

const checkConnectivity = () => {
  return isConnected;
};

export default {
  checkConnectivity,
};
