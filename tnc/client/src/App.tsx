import React, { useEffect, useState } from 'react';

const redirectUri = 'http://localhost:3000';
const credentials = {
  clientId: '',
  clientSecret: '',
};

const App = () => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [authCode, setAuthCode] = useState('');
  const [code , setCode] = useState<string | null>(null);
  const [name, setName] = useState<any>(null);

  useEffect(() => {
    const urlParam = new URLSearchParams(window.location.search);
    const code = urlParam.get('code');
    if (code) {
      setAuthCode(code);
    }
  }, []);

  useEffect(() => {
    const fetchToken = async (code: string) => {
      if (!credentials) return;
    setCode(code);
      try {
        const response = await fetch('https://api.intra.42.fr/oauth/token', {
          method: 'POST',
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            code: authCode,
            redirect_uri: redirectUri,
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        setData(result);

      const userResponse = await fetch(`https://api.intra.42.fr/v2/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${result.access_token}`,
        }
      });



      const userResult = await userResponse.json();
      setName(userResult);

        } catch (error) {
        console.error(error);
      }
    }
    if (authCode && credentials) {
      fetchToken(authCode);
    }
  }, [authCode]);

  const handleAuthorize = () => {
    if (!credentials) return;
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${credentials.clientId}&redirect_uri=${redirectUri}&response_type=code`;
  };

 
  const renderData = (data: any) => {
    if (!data) return <div>No data</div>;
      
    return (
      <ul>
        {Object.keys(data).map((key) => (
          <li key={key}>
            <strong>{key}:</strong>
            <pre><code>{typeof data[key] === 'object' ? JSON.stringify(data[key], null, 2) : data[key].toString()}</code></pre>
          </li>
        ))}
      </ul>
    );
  };

  const getCookies = () => {
    const cookies = document.cookie.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies[name] = value;
      return cookies;
    }, {} as Record<string, string>);
    console.log(cookies);
    return cookies;
  };

  return (
    <div>
      {code ? code : 'token olusmadi'}
      <h1>OAuth2 Authorization</h1>
      {!authCode && <button onClick={handleAuthorize}>Authorize</button>}
      {data && 
        <div>
          <h2>Token Data</h2>
          <button onClick={getCookies}>Get Cookies</button>
          {renderData(data)}
          {name?.image?.versions?.small ? (
            <img src={name.image.versions.small} alt="user" />
          ) : (
            "resim yok"
          )}
          {renderData(name)}
        </div>
      }
    </div>
  );
};


export default App;
