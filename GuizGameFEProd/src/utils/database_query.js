// Get specific question based on ID
const api = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

console.log(api);
console.log(apiKey);

export async function getQuestion(id){
    try {
        const question = await fetch(`${api}/question/${id}`);
        if (!question.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await question.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
}

// Get number of questions
export async function getQuestionLen(){
  try {
      const question_len = await fetch(`${api}/questions_len`);
      if (!question_len.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await question_len.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
}