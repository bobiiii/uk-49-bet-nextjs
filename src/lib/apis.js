

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export const getMetaData = async (type) => {
    const Url = SERVER_URL + `/api/metadata/get-metadata/${type}`;
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
    const Url = SERVER_URL + '/api/metadata/create-metadata';
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
    const Url = SERVER_URL + `/api/metadata/update-metadata/${id}`;
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
    const Url = SERVER_URL + `/api/metadata/delete-metadata/${id}`;

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
