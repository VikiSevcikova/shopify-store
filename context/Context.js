import { useState, createContext, useEffect } from 'react';
import { getDataFromStorage } from 'utils';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [items, setItems] = useState(0);
    useEffect(()=>{
        const localCheckout = getDataFromStorage('checkout');
        if(localCheckout) setItems(localCheckout.lineItems.length);
    },[]);
  return (
    <Context.Provider value={{items, setItems}}>
      {children}
    </Context.Provider>
  );
}

export const ContextConsumer = Context.Consumer;
