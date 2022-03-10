const handleResponse = async <T = {}>(response: Response): Promise<T> => {
  const { status, statusText } = response;
  console.debug({ status, statusText });
  if (200 <= status && status < 300) {
    if (status === 204) {
      return {} as T;
    }
    const result = await response.json();
    return result;
  } else if (300 <= status && status < 400) {
    throw new Error("returned unexpected response.");
  } else if (400 <= status && status < 500) {
    throw new Error(statusText);
  } else if (500 <= status) {
    throw new Error("internal server error occurred.");
  } else {
    throw new Error("unsupported status code returned.");
  }
};

const HOST = process.env.REACT_APP_TRACE_APP_HOST;

const get = async <T>(path: string): Promise<T> => {
  try {
    const response = await fetch(`${HOST}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse<T>(response);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const post = async <T>(path: string, payload: {}): Promise<T> => {
  try {
    const response = await fetch(`${HOST}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const Modules = { get, post };
export default Modules;
