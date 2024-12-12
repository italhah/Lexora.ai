'use client';

import { useState, useRef } from 'react';
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import { PlaceholdersAndVanishInput } from "@/app/components/ui/placeholders-and-vanish-input";
import { ButtonsCard } from "@/app/components/ui/tailwindcss-buttons";
import { HeroHighlight } from "@/app/components/ui/hero-highlight";
import { IconCopy, IconRefresh } from '@tabler/icons-react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  file?: File;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputValue, setInputValue] = useState(""); 
  const abortControllerRef = useRef<AbortController | null>(null);

  const placeholders = ["Ask Question..."];

  const handleSendMessage = async (text: string) => {
    if ((!text.trim() && !selectedFile) || isLoading) return;

    setIsLoading(true);
    setIsGenerating(true);
    const userMessage: Message = {
      id: messages.length + 1,
      text: text.trim() || (selectedFile ? `Uploaded file: ${selectedFile.name}` : ''),
      sender: 'user',
      file: selectedFile || undefined
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 2,
        text: data.result,
        sender: 'bot'
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Error in handleSendMessage:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      setSelectedFile(null);
      abortControllerRef.current = null;
    }
  };

  const handleButtonClick = (text: string) => {
    setInputValue(text);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue(""); 
  };

  const handleFileUpload = (file: File | null) => {
    setSelectedFile(file);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here if you want
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const regenerateResponse = (messageId: number) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1 && messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      handleSendMessage(previousUserMessage.text);
    }
  };

  const renderMessage = (message: Message) => {
  if (message.sender === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-lg rounded-lg mb-2 p-2 bg-blue-500 text-white">
          {message.text}
        </div>
      </div>
    );
  } else {
    const lines = message.text.split('\n');
    return (
      <div className="flex justify-start bg-zinc-900 rounded-lg p-2">
        <div className="w-full text-white text-sm">
          {lines.map((line, index) => (
            <div key={index} className={index > 0 ? 'mt-2' : ''}>
              {line.trim().startsWith('**') ? (
                <h3 className="font-bold ml-2 text-md">{line.replace(/\*\*/g, '').trim()}</h3>
              ) : line.trim().startsWith('-') ? (
                <div className="flex">
                  <span className="mr-2">•</span>
                  <span>{line.trim().substring(1).trim()}</span>
                </div>
              ) : (
                <TextGenerateEffect words={line.trim()} />
              )}
            </div>
          ))}
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={() => regenerateResponse(message.id)}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              title="Regenerate response"
            >
              <IconRefresh className="w-5 h-5" />
            </button>
            <button
              onClick={() => copyToClipboard(message.text)}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              title="Copy message"
            >
              <IconCopy className="w-5 h-5" />
            </button>            
          </div>
        </div>
      </div>
    );
  }
};

  return (
    <HeroHighlight>      
    <main className="flex w-full h-full min-w-[320px] min-h-[480px] flex-col bg-cover bg-center">
      <div className="z-20 w-full max-w-5xl min-h-[20vh] mx-auto px-4 py-10 mt-[10px] h-full">
          <h2 className="relative z-20 xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold text-center text-black dark:text-white tracking-tight">
            <div className="relative mx-auto xs:text-xl sm:text-3xl md:text-3xl lg:text-4xl text-center text-gray-300 inline-block w-max">How can  
              <span className="font-sans ml-2 mr-2 xs:text-2xl sm:text-4xl md:text-4xl lg:text-5xl bg-gradient-to-r from-blue-600 via-blue-400 to-blue-800 bg-clip-text text-transparent">
               LEXORA
              </span>assist you today?
            </div>
          </h2>
          <div className="bg-white/5 backdrop-blur-lg shadow-lg rounded-lg min-h-[20vh] max-w-full min-w-full w-full mt-6 p-4 xs:text-sm sm:text-sm md:text-sm lg:text-sm">
            <div className="space-y-4 max-h-[50vh] overflow-y-auto p-2">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.id}>
                    {renderMessage(message)}
                  </div>
                ))
              ) : (
                <div className="text-center h-[12px] xs:text-xs sm:text-xs md:text-sm lg:text-sm text-gray-500">No messages yet. Start a conversation!</div>
              )}
            </div>
            {error && <div className="bg-red-500 text-white text-center mt-4 p-2 rounded">{error}</div>}
            <div className="border-t border-gray-700 mt-4 pt-4">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)}
                onSubmit={onSubmit}
                onFileUpload={handleFileUpload}
                onStopGeneration={stopGeneration}
                isGenerating={isGenerating}
                isLoading={isLoading}
                loadingText="Generating..."
                value={inputValue}
              />
            </div>
            <div className="flex flex-wrap justify-center text-gray-300 gap-2 xs:gap-4 mt-4 xs:text-xs sm:text-xs md:text-sm lg:text-sm">
              {["Help me write", "Get Advice", "Code", "Summarize Text", "Brainstorm"].map((label) => (
                <ButtonsCard key={label} label={label} onClick={() => handleButtonClick(label)} />
              ))}
            </div>
          </div>
        </div>
        </main>
        <footer className="flex flex-wrap justify-center font-bold bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-800 bg-clip-text text-transparent xs:text-xs sm:text-xs md:text-sm lg:text-sm">
          <p>Design by Talha Rahman</p>
        </footer>
      </HeroHighlight>    
  );
}

