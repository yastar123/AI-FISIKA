import { useState } from "react";
import axios from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import MathJax from 'react-mathjax2';

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim() === "") {
      setResponse(["Masukkan pertanyaan yang valid!"]);
      return;
    }

    setLoading(true);
    setResponse([]);

    try {
      const prompt = `Silakan jawab pertanyaan berikut dengan bahasa Indonesia:\n${input}`;

      const res = await axios.post("", {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Harap jawab dalam bahasa Indonesia." }, 
          { role: "user", content: prompt }
        ],
      });

      const aiResponse = res.data.choices[0]?.message?.content || "Tidak ada respons.";
      const formattedResponse = aiResponse.split('\n').map((item: any) => item.trim()).filter(Boolean);
      setResponse(formattedResponse);
    } catch (error) {
      console.error(error);
      setResponse(["Terjadi kesalahan saat menghubungi API."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <h1 className="text-center">PhyQ (Physics Questions)</h1>
        <p>
          Tanyakan Apa Saja Tentang Fisika di sini!
        </p>
        <form onSubmit={handleSubmit} className="form-group mt-3">
          <textarea
            className="form-control"
            rows={4}
            placeholder="Ketik pertanyaan Anda..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="btn btn-primary mt-3 w-100"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </form>
        {response.length > 0 && (
          <div className="output-box mt-4 text-justify">
            {response.map((item: string, index: number) => (
              <div key={index}>
                {item.includes("=") && item.match(/(\d|[A-Za-z]+)(\s*\*?\s*[A-Za-z0-9]+)+/) ? (
                  <MathJax.Context input='tex'>
                    <div>
                      <MathJax.Node>{`\\(${item}\\)`}</MathJax.Node>
                    </div>
                  </MathJax.Context>
                ) : (
                  <p>{item}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
