
import React, { useState } from 'react';
import OpenAI from 'openai';
import axios from 'axios';
import 'dotenv/config'
function App() {
  require('dotenv').config()
  console.log(process.env)
  const apiKey=process.env.REACT_APP_API_KEY;
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [websiteAddress, setAddress] = useState('');
  const [table, setTable] = useState([]);
  const [error, setError] = useState('');

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    if (!isValidURL(websiteAddress)) {
      setError('Please enter a valid website address.');
      return;
    }
    e.preventDefault();
    const allQuestion = `${question} in this ${websiteAddress}`;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'Test system message' }, { role: 'user', content: allQuestion }],
        n: 4,
      });
      setAnswer(response.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const ComparingBtn = async () => {
    const question = "על כל האתרים בנושאי חוגים שסיפקתי לך ליצור טקסט שמספר על היתרונות והחסרונות של כל אתר בנפרד, ולאחר מכן להשוות בשאלות הקודמות תן לי טבלה חהשואת יתרונות וחסרונות תוכל לספק לי את זה שלהם לדוגמא האתרים https://www.arbox.co.il/verticals/hugim והאתר https://club-tec.co.il/#ourtestimonials-bookmark";
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Test system message' },
            { role: 'user', content: question }
          ],
          n: 4,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );
      console.log("Response:", response);
      console.log("Response Data:", response.data);
      console.log(response.data.choices[0].message.content);
      setTable(response.data.choices[3].message.content);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={websiteAddress}
          onChange={(e) => {
            setAddress(e.target.value);
            setError('');
          }}
          placeholder="Enter a website address"
        />
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter a question"
        />
        <button type="submit">submit</button>
        <button onClick={ComparingBtn}>Comparing websites:</button>
      </form>

      {answer && (
        <div>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
      <h3>Comparison Table:</h3>
      <table>
        <tbody>
          {table}
        </tbody>
      </table>
    </div>
  );
}
export default App;

