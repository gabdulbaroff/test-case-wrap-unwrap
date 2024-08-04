import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGetTokenPrice = (tokenId: string) => {
    const [price, setPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price`,
                    {
                        params: {
                            ids: tokenId,
                            vs_currencies: 'usd'
                        }
                    }
                );
                setPrice(response.data[tokenId].usd);
            } catch (err) {
                setError('Failed to fetch token price');
            } finally {
                setLoading(false);
            }
        };

        fetchPrice();
    }, [tokenId]);

    return { price, loading, error };
};