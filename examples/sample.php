<?php

class SampleClass {
    private $property;

    public function __construct($value) {
        $this->property = $value;
    }

    public function getProperty() {
        return $this->property;
    }

    public function setProperty($value) {
        $this->property = $value;
    }

    public function displayProperty() {
        echo "The property value is: " . $this->property;
    }

    public function overrideSomeVariable() {
        $variableNotOverride = "Overridden Value";

        $variableToBeOverride = "Overridden Value";
        // this will show warning.
        $variableToBeOverride = "Overridden Value";
    }
}

// Example usage
$sample = new SampleClass("Initial Value");
$sample->displayProperty();
$sample->setProperty("New Value");
$sample->displayProperty();
?>