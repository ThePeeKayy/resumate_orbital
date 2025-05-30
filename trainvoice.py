import torch
import torch.nn as nn
import torch.optim as optim
import torchaudio
from torchaudio.datasets import SPEECHCOMMANDS
from torch.utils.data import DataLoader, random_split

class audioDataset(torch.utils.data.Dataset):
    # Calling on dataset from the library
    def __init__(self, root_dir="./data", subset="training"):
        self.dataset = SPEECHCOMMANDS(root_dir, subset=subset, download=True)
        
    def __getitem__(self, idx):
        waveform, sample_rate, _, _, _ = self.dataset[idx]
        # 16kHZ 
        resampler = torchaudio.transforms.Resample(sample_rate, 16000)
        waveform = resampler(waveform)
        
        if waveform.shape[1] > 16000:
            waveform = waveform[:, :16000]
        else:
            waveform = torch.nn.functional.pad(waveform, (0, 16000 - waveform.shape[1]))
        pace_score = torch.rand(1)
        tone_score = torch.rand(1)
        return waveform, torch.cat([pace_score, tone_score])
    
    def __len__(self):
        return len(self.dataset)
    
class audioModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.wavModel = torchaudio.pipelines.WAV2VEC2_BASE.get_model()
        for param in self.wavModel.parameters():
            param.requires_grad = False
        self.classifier = nn.Sequential(
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 64),
            nn.ReLU(),
            nn.Linear(64, 2)
        )
        
    def forward(self, x):
        with torch.no_grad():
            '''
            (Copied from documentation)
            Returns:
            List of Tensors
            Features from requested layers. Each Tensor is of shape: (batch, time frame, feature dimension)

            Tensor or None
            If lengths argument was provided, a Tensor of shape (batch, ) is returned. It indicates the valid length in time axis of each feature Tensor.
            '''
            features, _ = self.wavModel.extract_features(x)
        features = features[-1].mean(dim=1)
        return self.classifier(features)
    
def train_epoch(model, loader, optimizer, criterion, device):
    model.train()
    total_loss = 0
    for waveform, targets in loader:
        waveform, targets = waveform.to(device), targets.to(device)
        optimizer.zero_grad()
        outputs = model(waveform.squeeze(1))
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(loader)

def validate_epoch(model, loader, criterion, device):
    model.eval()
    total_loss = 0
    with torch.no_grad():
        for waveform, targets in loader:
            waveform, targets = waveform.to(device), targets.to(device)
            outputs = model(waveform.squeeze(1))
            loss = criterion(outputs, targets)
            total_loss += loss.item()
    return total_loss / len(loader)



def main():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    dataset = audioDataset()
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False)
    
    model = audioModel().to(device)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()
    
    for epoch in range(20):
        train_loss = train_epoch(model, train_loader, optimizer, criterion, device)
        val_loss = validate_epoch(model, val_loader, criterion, device)
        if epoch % 5 == 0:
            print(f"Epoch {epoch}: Train {train_loss:.4f}, Val {val_loss:.4f}")
    
    torch.save(model.state_dict(), "pace_tone_model.pth")
    print("Training complete")

if __name__ == "__main__":
    main()

# def predict_audio(model, audio_path, device):
