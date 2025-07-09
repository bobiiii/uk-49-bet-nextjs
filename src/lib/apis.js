

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export const getMetaData = async (type) => {
    const Url = SERVER_URL + `metadata/get-metadata/${type}`;
    try {

        const response = await fetch(Url, {
            method: 'GET',
            cache: 'no-store',
        })


        if (!response?.ok) {
            console.error("error Appeared");

        }

        const result = await response.json()
        return result

    } catch (error) {
        return error
    }


}


export const addMetaDataApiCall = async (data, type) => {
    const Url = SERVER_URL + 'metadata/create-metadata';
    const formData = new FormData();

    formData?.append('entityType', type);
    formData?.append('title', data?.title);
    formData?.append('description', data?.description);
    formData?.append('keywords', JSON.stringify(data.keywords));
    formData?.append('canonical', data?.canonical);
    formData?.append('ogTitle', data?.ogTitle);
    formData?.append('ogDescription', data?.ogDescription);
    formData?.append('ogImageId', data?.ogImageId);
    formData?.append('ogImageAlt', data?.ogImageAlt);
    // formData?.append('ogImage', data?.ogImage[0]);

    return fetch(Url, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        // headers: {
        //     authorization: `Bearer ${token}`,
        // },
    },
    )
        .then((response) => response?.json())
        .then((data) => {
            return data
        })
        .catch((error) => {
            return error
        });
};


export const updateMetaDataApiCall = async (data, type, id) => {
    const Url = SERVER_URL + `metadata/update-metadata/${id}`;
    const formData = new FormData();

    formData?.append('entityType', type);
    formData?.append('title', data?.title);
    formData?.append('description', data?.description);
    formData?.append('keywords', JSON.stringify(data.keywords));
    formData?.append('canonical', data?.canonical);
    formData?.append('ogTitle', data?.ogTitle);
    formData?.append('ogDescription', data?.ogDescription);
    formData?.append('ogImageId', data?.ogImageId);
    formData?.append('ogImageAlt', data?.ogImageAlt);

    // optional image upload
    // formData?.append('ogImage', data?.ogImage?.[0]);

    return fetch(Url, {
        method: 'PUT',
        body: formData,
        mode: 'cors',
        // headers: {
        //   authorization: `Bearer ${token}`,
        // },
    })
        .then((response) => response?.json())
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error;
        });
};


export const deleteMetaDataApiCall = async (id) => {
    const Url = SERVER_URL + `metadata/delete-metadata/${id}`;

    return fetch(Url, {
        method: 'DELETE',
        mode: 'cors',
        // headers: {
        //     authorization: `Bearer ${token}`,
        // },
    })
        .then((response) => response?.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return error;
        });
};


// Predications APis


export const addPredictionApiCall = async (data) => {
    const Url = SERVER_URL + 'predictions/create-prediction';

    const payload = {
        date: data?.date,
        drawType: data?.drawType,
        numbers: data?.numbers,
        confidenceLevel: data?.confidence,
        status: data?.status,
    };

    try {
        const response = await fetch(Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`, // Uncomment if needed
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        return result;
    } catch (error) {
        return {
            error: 'Network Error',
            details: error.message || error,
        };
    }
};


export const getPredictionsApiCall = async () => {
    const Url = SERVER_URL + `predictions/get-predictions/`;
    try {
        const res = await fetch(Url, {
            method: 'GET',
            cache: 'no-store',
        })

        const result = await res.json();
        return result;
    } catch (error) {
        return {
            error: 'Network error',
            details: error.message,
        };
    }
};


export const DeletePredictionsApiCall = async (id) => {
    const Url = SERVER_URL + `predictions/delete-prediction/${id}`;
    try {
        const res = await fetch(Url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const result = await res.json();
        return result;
    } catch (error) {
        return {
            error: 'Network error',
            details: error.message,
        };
    }
};



export const updatePredictionApiCall = async (data, id) => {
    const Url = SERVER_URL + `predictions/update-prediction/${id}`;

    const payload = {
        date: data?.date,
        drawType: data?.drawType,
        numbers: data?.numbers,
        confidenceLevel: data?.confidence,
        status: data?.status,
    };

    try {
        const response = await fetch(Url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`, // Uncomment if needed
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        return result;
    } catch (error) {
        return {
            error: 'Network Error',
            details: error.message || error,
        };
    }
};


export const getLunchtimeApiCall = async (data) => {
    const Url = SERVER_URL + `results/lunchtime/get`;
    try {
        const res = await fetch(Url, {
            method: 'GET',
            cache: 'no-store',
        })

        const result = await res.json();
        return result;
    } catch (error) {
        return {
            error: 'Network error',
            details: error.message,
        };
    }
}

export const getTeatimeApiCall = async (data) => {
    const Url = SERVER_URL + `results/teatime/get`;
    try {
        const res = await fetch(Url, {
            method: 'GET',
            cache: 'no-store',
        })

        const result = await res.json();
        return result;
    } catch (error) {
        return {
            error: 'Network error',
            details: error.message,
        };
    }
}

