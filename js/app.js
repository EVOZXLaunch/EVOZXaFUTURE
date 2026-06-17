import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

const FACTORY_ADDR = "0xbA40773bCF0d30e83c4319796Ec45CA31d6e64bB";
const EVOZX_ADDR = "0x032a962F62Fc1cbc15B19767Aa138deA3B454B74";

// ABI minimal yang diperlukan dari file Anda
const FACTORY_ABI = ["function deployToken(tuple(string name, string symbol, uint256 supply, address owner, uint256 chainId, uint16 launchKitVersion, bool burnable, bool mintable, bool ownershipEnabled, string website, string telegram, string twitter, string logoURI, bool maxWalletEnabled, uint8 maxWalletPercent, bool maxTxEnabled, uint8 maxTxPercent, bool tradingControlEnabled, bool tradingEnabled, bool buyTaxEnabled, uint8 buyTax, bool sellTaxEnabled, uint8 sellTax, uint8 burnTaxShare, address marketingWallet, address developmentWallet) config) external"];
const EVOZX_ABI = ["function approve(address spender, uint256 amount) public returns (bool)"];

async function deploy() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // 1. Setup Kontrak
    const factory = new ethers.Contract(FACTORY_ADDR, FACTORY_ABI, signer);
    const evozx = new ethers.Contract(EVOZX_ADDR, EVOZX_ABI, signer);
    
    // 2. Approve Fee (Hardcoded 10 EVOZX sesuai instruksi)
    const fee = ethers.parseEther("10"); 
    const txApprove = await evozx.approve(FACTORY_ADDR, fee);
    await txApprove.wait();

    // 3. Deploy
    const config = {
        name: document.getElementById('name').value,
        symbol: document.getElementById('symbol').value,
        supply: ethers.parseEther(document.getElementById('supply').value),
        owner: await signer.getAddress(),
        chainId: 805,
        launchKitVersion: 200,
        // ... (fitur lainnya diisi dari input/default)
        burnable: document.querySelector('[value="burnable"]').checked,
        mintable: document.querySelector('[value="mintable"]').checked,
        ownershipEnabled: true,
        website: "", telegram: "", twitter: "", logoURI: "",
        maxWalletEnabled: false, maxWalletPercent: 0,
        maxTxEnabled: false, maxTxPercent: 0,
        tradingControlEnabled: false, tradingEnabled: true,
        buyTaxEnabled: false, buyTax: 0,
        sellTaxEnabled: false, sellTax: 0,
        burnTaxShare: 0,
        marketingWallet: "0x0000000000000000000000000000000000000000",
        developmentWallet: "0x0000000000000000000000000000000000000000"
    };

    const tx = await factory.deployToken(config);
    const receipt = await tx.wait();
    
    document.getElementById('txStatus').innerHTML = `Success! Token Deployed at: ${receipt.contractAddress}`;
    // Trigger download verifikasi di sini
}

document.getElementById('deployBtn').addEventListener('click', deploy);

