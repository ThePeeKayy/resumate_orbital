import os
import glob
import torch
import argparse
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments, DataCollatorForLanguageModeling, set_seed
from datasets import Dataset
from peft import LoraConfig, get_peft_model

def parse_args():

    # Easier for manual input
    parser = argparse.ArgumentParser()
    parser.add_argument("--model_name", default="deepseek-ai/DeepSeek-R1-Distill-Qwen-7B")
    parser.add_argument("--data_dir", default="./data")
    parser.add_argument("--output_dir", default="./model-finetuned")
    parser.add_argument("--epochs", type=int, default=3)
  
    parser.add_argument("--batch_size", type=int, default=1)
    parser.add_argument("--max_length", type=int, default=256)
    parser.add_argument("--lr", type=float, default=1e-4)
  
    return parser.parse_args()

def load_data(data_dir, tokenizer, max_length):
    texts = []
    for file in glob.glob(f"{data_dir}/*.txt"):
        with open(file, "r", encoding="utf-8") as f:
            text = f.read().strip()
            if text: texts.append(text)
    
    def tokenize(examples):
        return tokenizer(examples["text"], truncation=True, max_length=max_length, padding="max_length")
    
    dataset = Dataset.from_dict({"text": texts})
    return dataset.map(tokenize, batched=True, remove_columns=["text"])

def main():
    args = parse_args()
    # for reproducability
  
    set_seed(42)    
    tokenizer = AutoTokenizer.from_pretrained(args.model_name, trust_remote_code=True)
    if not tokenizer.pad_token: tokenizer.pad_token = tokenizer.eos_token
    
    model = AutoModelForCausalLM.from_pretrained(
        args.model_name, trust_remote_code=True, torch_dtype=torch.float16, device_map="cuda"
    )
    
    #Check lora
    peft_config = LoraConfig(r=4, lora_alpha=8, target_modules=["q_proj", "v_proj"], lora_dropout=0.05, task_type="CAUSAL_LM")
    model = get_peft_model(model, peft_config)
    model.gradient_checkpointing_enable()
    
    dataset = load_data(args.data_dir, tokenizer, args.max_length)
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
    
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=4,
        learning_rate=args.lr,
        logging_steps=50,
        save_steps=500,
        bf16=True,
        gradient_checkpointing=True,
        optim="adamw_torch",
        lr_scheduler_type="cosine",
        save_total_limit=1
    )
    
    # Train portiohn
    trainer = Trainer(model=model, args=training_args, data_collator=data_collator, train_dataset=dataset)
    trainer.train()
    
    # Save
    trainer.save_model(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)

if __name__ == "__main__":
    main()
