import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Update getAI to accept an optional key
content = content.replace(
  `  const getAI = (): GoogleGenAI => {
    if (!aiInstance) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error("GEMINI_API_KEY is not defined");
      aiInstance = new GoogleGenAI({ apiKey: key });
    }
    return aiInstance;
  };`,
  `  const getAI = (clientKey?: string): GoogleGenAI => {
    const key = clientKey || process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not defined");
    return new GoogleGenAI({ apiKey: key });
  };`
);

content = content.replace(/await getAI\(\)/g, "await getAI(req.headers['x-gemini-key'] as string)");

// Change mock fallback to throw 401 if missing key
content = content.replace(
  `    } catch (e: any) {
      console.log("Using mock data fallback due to invalid API key.");
      return res.json({`,
  `    } catch (e: any) {
      if (e.message.includes('GEMINI_API_KEY is not defined')) {
         return res.status(401).json({ error: 'API Key Required' });
      }
      console.log("Using mock data fallback due to error.", e);
      return res.json({`
);

content = content.replace(
  `    } catch (e: any) {
      console.log("Using mock data fallback due to invalid API key.");
      return res.json({`,
  `    } catch (e: any) {
      if (e.message.includes('GEMINI_API_KEY is not defined')) {
         return res.status(401).json({ error: 'API Key Required' });
      }
      console.log("Using mock data fallback due to error.", e);
      return res.json({`
);

content = content.replace(
  `    } catch (e: any) {
      console.log("Using mock data fallback due to invalid API key.");
      return res.json({`,
  `    } catch (e: any) {
      if (e.message.includes('GEMINI_API_KEY is not defined')) {
         return res.status(401).json({ error: 'API Key Required' });
      }
      console.log("Using mock data fallback due to error.", e);
      return res.json({`
);

fs.writeFileSync('server.ts', content);
