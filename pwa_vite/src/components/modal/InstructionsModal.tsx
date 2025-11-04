import { usePWAInstallContext } from "../../context/pwa-install/usePWAInstallContext";
import { instructions } from "../../constants/instructions";

import Modal from "../../ui/Modal";
import Card from "../../ui/Card";
import { X } from "lucide-react";

const InstructionsModal = () => {
  const { showIOSInstructions, setShowIOSInstructions } = usePWAInstallContext();

  const handleClose = () => setShowIOSInstructions(false);

  return (
    <Modal
      isOpen={showIOSInstructions}
      onClose={handleClose}
      className="items-center justify-center p-2"
    >
      <Card className="max-w-[540px] w-full relative space-y-4 p-4 bg-white">
        <div className="flex justify-between gap-4">
          <h2 className="text-2xl font-medium">Instructions</h2>

          <button onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="py-4">
          <ol className="list-decimal list-inside space-y-2 text-gray-800">
            {instructions.map(({ text, image }, index) => (
              <li key={index}>
                <span>{text}</span>

                {image && <img src={image} alt="" className="" />}
              </li>
            ))}
          </ol>
        </div>
      </Card>
    </Modal>
  );
};

export default InstructionsModal;
