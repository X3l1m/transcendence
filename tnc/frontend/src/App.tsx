/* import React, { useEffect, useState } from 'react';
import './App.css'; // CSS dosyasını içe aktarın

const App = () => {
  const [message, setMessages] = useState([]);
  const [isMounted, setIsMounted] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!isMounted) return;

    const eventSource = new EventSource('http://localhost:5000/events/sse');

    eventSource.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    return () => {
      eventSource.close();
    };
  }, [isMounted]);

  const toggleMount = () => {
    setIsMounted(!isMounted);
  };

  const handleClick = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
    toggleMount();
  };

  return (
    <div>
      {isMounted ? (
        <>
          <p>{message}</p>
          <button className={`button ${animate ? 'buttonClick' : ''}`} onClick={handleClick}>Unmount</button>
        </>
      ) : (
        <>
          <p>Component unmounted</p>
          <button className={`button ${animate ? 'buttonClick' : ''}`} onClick={handleClick}>Mount</button>
        </>
      )}
    </div>
  );
};

export default App; */

import React, { useEffect, useState } from 'react';
import axios from 'axios';


const App = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:5000/domates');
      setData(result.data);
    }
    fetchData();

    const interval = setInterval(fetchData, 1000);
    return (clearInterval(interval));
  }, []);

  return (
    <div>
      {data ? <div>{data}</div> : <div>Loading...</div>}
    </div>
  )
}

export default App;