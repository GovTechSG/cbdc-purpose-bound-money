setup-local-fixtures:
	@echo "Setting up localhost fixtures..."
	npx hardhat fixtures:deploy-pbm --network localhost
	npx hardhat fixtures:payments --network localhost --pbm 0x9B9eb636b3dCdB515A4746781D235B1501162275
	npx hardhat dsgd:mint --dsgd 0x36d19301F73A0a2C5d8ac0BEe7EB8CF838F2A66A --to 0x39CAcedEEeD9cdA95393E35c4Cd31539C7D32955 --amount 25000 --network localhost
	@echo "Done."
