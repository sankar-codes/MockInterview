import fs from 'fs';
let code = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

if (!code.includes('const [errorMsg, setErrorMsg] = useState<string | null>(null);')) {
  code = code.replace(
    'const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);',
    'const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);\n  const [errorMsg, setErrorMsg] = useState<string | null>(null);'
  );
  
  code = code.replace(
    '} catch (error) {\n      if (isMounted.current) setIsLoading(false);\n    }',
    `} catch (error: any) {
      if (isMounted.current) {
        setIsLoading(false);
        setErrorMsg(error.message || 'An error occurred during initialization.');
      }
    }`
  );
  
  code = code.replace(
    'catch (error) {\n        console.error("Failed to generate next question:", error);\n        if (isMounted.current) setIsLoading(false);\n      }',
    `catch (error: any) {
        console.error("Failed to generate next question:", error);
        if (isMounted.current) {
          setIsLoading(false);
          setErrorMsg(error.message || 'An error occurred while fetching the next question.');
        }
      }`
  );
  
  code = code.replace(
    '<div className="text-center py-12">',
    `{errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 text-center">
          {errorMsg}
        </div>
      )}
      <div className="text-center py-12">`
  );
  fs.writeFileSync('src/components/InterviewSession.tsx', code);
}
